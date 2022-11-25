import graphene

from todo.models import ToDo
from graphene_django import DjangoObjectType


class ToDoType(DjangoObjectType):
    class Meta:
        model = ToDo
        fields = "__all__"


class ToDoQuery(graphene.ObjectType):
    all_todo = graphene.List(ToDoType)

    def resolve_all_todo(root, info):
        return ToDo.objects.all()


class Query(
        ToDoQuery,
        graphene.ObjectType):
    pass


class TodoAddMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String()
        checked = graphene.Boolean()

    code = graphene.String()
    msg = graphene.String()

    @classmethod
    def mutate(cls, root, info, title, description, checked=False):
        try:
            ToDo.objects.create(
                title=title, description=description, checked=checked)
            return TodoAddMutation(code='success', msg='')
        except Exception as e:
            return TodoAddMutation(code='wrong_value', msg=str(e))


class TodoUpdateMutation(graphene.Mutation):

    """
    ADD UPDATE FUNCTION
    """

    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String(required=True)
        description = graphene.String()

    code = graphene.String()
    msg = graphene.String()


    @classmethod
    def mutate(cls, root, info, id,title, description):
        try:
            todo = ToDo.objects.get(id=id)
            todo.title = title
            todo.description = description
            todo.save()
            return TodoAddMutation(code='success', msg='')
        except Exception as e:
            return TodoAddMutation(code='wrong_value', msg=str(e))


class TodoDeleteMutation(graphene.Mutation):

    """
    MODIFY DELETE FUNCTION
    """

    class Arguments:
        id = graphene.Int(required=True)

    code = graphene.String()
    msg = graphene.String()

    @classmethod
    def mutate(cls, root, info, id):
        try:
            todo = ToDo.objects.get(id=id)
            todo.delete()
            return TodoDeleteMutation(code='success', msg='')
        except Exception as e:
            return TodoDeleteMutation(code='wrong_value', msg=str(e))


class Mutation(graphene.ObjectType):
    add_todo = TodoAddMutation.Field()
    delete_todo = TodoDeleteMutation.Field()

    """
    ADD UPDATE
    """
    update_todo = TodoUpdateMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
